package org.example.config;

import io.minio.MinioClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



@Configuration
public class MinioConfig {

    private static final Logger log = LoggerFactory.getLogger(MinioConfig.class);

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.access-key}")
    private String acccessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Bean
    public MinioClient minioClient() {

        try {
           MinioClient minioClient = MinioClient.builder()
                   .endpoint(endpoint)
                   .credentials(acccessKey, secretKey)
                   .build();

           boolean buckerExists = minioClient.bucketExists(
                   io.minio.BucketExistsArgs.builder()
                           .bucket(bucketName)
                           .build()
           );

           if (!buckerExists) {
               log.info("Creting bucket: {}", bucketName);
               minioClient.makeBucket(
                       io.minio.MakeBucketArgs.builder()
                               .bucket(bucketName)
                               .build()
               );
               log.info("Bucket '{}' creating successfully", bucketName);
           } else {
               log.info("Bucket '{}' already exists", bucketName);
           }

           return minioClient;
        } catch (Exception e) {
            log.error("Error initializing MinIO client: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize MinIO client", e);
        }
    }
}
