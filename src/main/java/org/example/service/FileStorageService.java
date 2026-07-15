package org.example.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final MinioClient minioClient;
    private final String bucketName;

    public FileStorageService(
            MinioClient minioClient,
            @Value("${minio.bucket-name}") String bucketName
    ) {
        this.minioClient = minioClient;
        this.bucketName = bucketName;
    }

    public String uploadFile(MultipartFile file, String folder) {

        try {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String filename = UUID.randomUUID() + extension;

            String objectName = folder + "/" + System.currentTimeMillis() + "/" + filename;

            InputStream inputStream = file.getInputStream();
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            log.info("File uploaded successfully: {}", objectName);

            return getPublicUrl(objectName);
        } catch (Exception e) {
            log.error("Error uploaded file: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public String getPublicUrl(String objectName) {

        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .method(Method.GET)
                            .expiry(7, TimeUnit.DAYS)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error generating URL: {}", e.getMessage());
            throw new RuntimeException("Failed to generated URL", e);
        }
    }

    public void deleteFile(String fileUrl) {

        try {
            String objectName = extractObjectNameFromUrl(fileUrl);
            if (objectName != null) {
                minioClient.removeObject(
                        RemoveObjectArgs.builder()
                                .bucket(bucketName)
                                .object(objectName)
                                .build()
                );
                log.info("File deleted: {}", objectName);
            }
        } catch (Exception e) {
            log.error("Error delitiong file: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    public String extractObjectNameFromUrl(String url) {

        if (url == null || url.isEmpty()) {
            return null;
        }

        try {

            URL parsedUrl = new URL(url);
            String path = parsedUrl.getPath();

            String bucketPrefix = "/" + bucketName + "/";
            if (path.startsWith(bucketPrefix)) {
                String objectName = path.substring(bucketPrefix.length());
                log.info("Extracted object name: {}", objectName);
                return objectName;
            }

            String fullPath = parsedUrl.getFile();
            String[] parts = fullPath.split("\\?");
            String cleanPath = parts[0];

            if (cleanPath.startsWith(bucketPrefix)) {
                String objectName = cleanPath.substring(bucketPrefix.length());
                log.info("Extracted object name from clean path: {}", objectName);
                return objectName;
            }

            log.warn("Could not extract object name from URL: {}", url);
            return null;

        } catch (Exception e) {
            log.error("Error extracting object name from URL: {}", e.getMessage());
            return null;
        }
    }

    public void deleteFileByObjectName(String objectName) {
        try {
            if (objectName == null || objectName.isEmpty()) {
                log.warn("Object name is empty, skipping deletion");
                return;
            }

            log.info("Deleting file by object name: {}", objectName);
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            log.info("File deleted successfully: {}", objectName);

        } catch (Exception e) {
            log.error("Error deleting file by object name: {}", e.getMessage());
        }
    }
}
