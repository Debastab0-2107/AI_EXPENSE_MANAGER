package com.expensemanager.service;

import java.util.List;

import com.expensemanager.dto.NotificationResponse;
import com.expensemanager.enums.NotificationType;

public interface NotificationService {

    NotificationResponse createNotification(
            Long userId,
            NotificationType type,
            String title,
            String message);

    List<NotificationResponse> getMyNotifications(
            String email);

    List<NotificationResponse> getMyUnreadNotifications(
            String email);

    long getUnreadCount(
            String email);

    void markAsRead(
            Long notificationId,
            String email);

    void markAllAsRead(
            String email);

    void deleteNotification(
            Long notificationId,
            String email);
}