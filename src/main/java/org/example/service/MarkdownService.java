package org.example.service;

import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.springframework.stereotype.Service;

@Service
public class MarkdownService {

    private final Parser parser = Parser.builder().build();
    private final HtmlRenderer renderer = HtmlRenderer.builder().escapeHtml(true).build();

    public String renderMarkdown(String markdown) {
        if (markdown == null || markdown.isEmpty()) {
            return "";
        }
        Node document = parser.parse(markdown);
        String html = renderer.render(document);

        html = html.replaceAll("(?<=>)\\s+(?=<)", "");
        html = html.replaceAll("\\n", "");

        return html;
    }

//    public String renderMarkdown(String markdown) {
//        Parser parser = Parser.builder().build();
//        Node document = parser.parse(markdown);
//        HtmlRenderer renderer = HtmlRenderer.builder().escapeHtml(true).build();
//
//        return renderer.render(document);
//    }
}
