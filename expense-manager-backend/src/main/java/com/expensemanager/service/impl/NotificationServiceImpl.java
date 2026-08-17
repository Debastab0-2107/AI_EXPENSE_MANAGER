package com.expensemanager.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expensemanager.dto.NotificationResponse;
import com.expensemanager.entity.Notification;
import com.expensemanager.entity.User;
import com.expensemanager.enums.NotificationType;
import com.expensemanager.repository.NotificationRepository;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.service.NotificationService;

@Service
@Transactional
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    @Override
    public NotificationResponse createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Notification notification =
                new Notification(
                        user,
                        type,
                        title,
                        message);

        Notification saved =
                notificationRepository.save(notification);

        return convertToResponse(saved);
    }

    // =====================================================
    // GET ALL MY NOTIFICATIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =====================================================
    // GET UNREAD NOTIFICATIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyUnreadNotifications(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                        user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .countByUserIdAndReadFalse(user.getId());
    }

    // =====================================================
    // MARK ONE AS READ
    // =====================================================

    @Override
    public void markAsRead(
            Long notificationId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        // Security check:
        // User can only modify their own notification
        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this notification");
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    @Override
    public void markAllAsRead(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndReadFalseOrderByCreatedAtDesc(
                                user.getId());

        notifications.forEach(
                notification ->
                        notification.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    @Override
    public void deleteNotification(
            Long notificationId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"));

        // Security check
        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    // =====================================================
    // ENTITY → DTO
    // =====================================================

    private NotificationResponse convertToResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}