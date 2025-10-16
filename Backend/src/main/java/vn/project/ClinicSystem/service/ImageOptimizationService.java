package vn.project.ClinicSystem.service;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ImageOptimizationService {

    private static final int MAX_WIDTH = 800;
    private static final int MAX_HEIGHT = 600;
    private static final float COMPRESSION_QUALITY = 0.8f;

    public byte[] optimizeImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File không được null hoặc rỗng");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File phải là hình ảnh");
        }

        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        if (originalImage == null) {
            throw new IOException("Không thể đọc hình ảnh");
        }

        // Tính toán kích thước mới
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        
        int newWidth = originalWidth;
        int newHeight = originalHeight;

        if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
            double widthRatio = (double) MAX_WIDTH / originalWidth;
            double heightRatio = (double) MAX_HEIGHT / originalHeight;
            double ratio = Math.min(widthRatio, heightRatio);
            
            newWidth = (int) (originalWidth * ratio);
            newHeight = (int) (originalHeight * ratio);
        }

        // Resize image
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
        g2d.drawImage(originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH), 0, 0, null);
        g2d.dispose();

        // Convert to byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        String formatName = getImageFormat(contentType);
        ImageIO.write(resizedImage, formatName, baos);

        byte[] optimizedBytes = baos.toByteArray();
        log.info("Hình ảnh đã được tối ưu: {} -> {} bytes ({}x{} -> {}x{})", 
                file.getSize(), optimizedBytes.length, originalWidth, originalHeight, newWidth, newHeight);

        return optimizedBytes;
    }

    public boolean isImageOptimizable(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    public long getOptimizationRatio(MultipartFile originalFile, byte[] optimizedBytes) {
        if (originalFile == null || optimizedBytes == null) {
            return 0;
        }
        return originalFile.getSize() - optimizedBytes.length;
    }

    private String getImageFormat(String contentType) {
        if (contentType == null) {
            return "jpg";
        }
        
        switch (contentType.toLowerCase()) {
            case "image/png":
                return "png";
            case "image/gif":
                return "gif";
            case "image/bmp":
                return "bmp";
            default:
                return "jpg";
        }
    }
}
