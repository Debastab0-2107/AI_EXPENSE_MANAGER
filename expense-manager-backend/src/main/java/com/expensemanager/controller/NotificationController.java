package com.expensemanager.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.expensemanager.dto.NotificationResponse;
import com.expensemanager.entity.User;
import com.expensemanager.enums.NotificationType;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository) {

        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getMyNotifications(Principal principal) {

        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        principal.getName()));
    }

    // =====================================================
    // GET UNREAD NOTIFICATIONS
    // =====================================================

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>>
    getUnreadNotifications(Principal principal) {

        return ResponseEntity.ok(
                notificationService.getMyUnreadNotifications(
                        principal.getName()));
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @GetMapping("/unread/count")
    public ResponseEntity<Long>
    getUnreadCount(Principal principal) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        principal.getName()));
    }

    // =====================================================
    // CREATE TEST NOTIFICATION
    // =====================================================
    //
    // This is ONLY for testing Phase 16.
    //
    // Later, Expense/Income/Budget/AI services will
    // create notifications automatically.
    // =====================================================

    @PostMapping("/test")
    public ResponseEntity<NotificationResponse>
    createTestNotification(
            Principal principal,
            @RequestParam NotificationType type,
            @RequestParam String title,
            @RequestParam String message) {

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        NotificationResponse response =
                notificationService.createNotification(
                        user.getId(),
                        type,
                        title,
                        message);

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<String>
    markAsRead(
            @PathVariable Long id,
            Principal principal) {

        notificationService.markAsRead(
                id,
                principal.getName());

        return ResponseEntity.ok(
                "Notification marked as read");
    }

    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    @PutMapping("/read-all")
    public ResponseEntity<String>
    markAllAsRead(Principal principal) {

        notificationService.markAllAsRead(
                principal.getName());

        return ResponseEntity.ok(
                "All notifications marked as read");
    }

    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteNotification(
            @PathVariable Long id,
            Principal principal) {

        notificationService.deleteNotification(
                id,
                principal.getName());

        return ResponseEntity.ok(
                "Notification deleted successfully");
    }
}