package com.expensemanager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.expensemanager.entity.Expense;
import com.expensemanager.entity.User;
import com.expensemanager.enums.ExpenseCategory;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long> {

    Optional<Expense> findByIdAndUser(
            Long id,
            User user);

    Page<Expense> findAllByUser(
            User user,
            Pageable pageable);

    @Query("""
        SELECT e FROM Expense e
        WHERE e.user = :user
          AND (:keyword IS NULL OR
               LOWER(e.title) LIKE
               LOWER(CONCAT('%', :keyword, '%')))
          AND (:category IS NULL OR
               e.category = :category)
          AND (:from IS NULL OR
               e.expenseDate >= :from)
          AND (:to IS NULL OR
               e.expenseDate <= :to)
        """)
    Page<Expense> searchAndFilter(
            @Param("user") User user,
            @Param("keyword") String keyword,
            @Param("category") ExpenseCategory category,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            Pageable pageable);

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user = :user
          AND e.expenseDate >= :from
          AND e.expenseDate <= :to
        """)
    BigDecimal getTotalExpenseBetween(
            @Param("user") User user,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);

    @Query("""
        SELECT COUNT(e)
        FROM Expense e
        WHERE e.user = :user
          AND e.expenseDate >= :from
          AND e.expenseDate <= :to
        """)
    long countExpenseBetween(
            @Param("user") User user,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
    
    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user = :user
            AND e.category = :category
            AND MONTH(e.expenseDate) = :month
            AND YEAR(e.expenseDate) = :year
            """)
    BigDecimal getTotalSpentByCategoryAndMonth(
            @Param("user") User user,
            @Param("category") ExpenseCategory category,
            @Param("month") int month,
            @Param("year") int year);
    
    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user = :user
            """)
    BigDecimal getTotalExpense(
            @Param("user") User user);
    
    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user = :user
            AND MONTH(e.expenseDate) = :month
            AND YEAR(e.expenseDate) = :year
            """)
    BigDecimal getMonthlyExpense(
            @Param("user") User user,
            @Param("month") int month,
            @Param("year") int year);
    
    @Query("""
            SELECT e.category, COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.user = :user
            GROUP BY e.category
            ORDER BY SUM(e.amount) DESC
            """)
    List<Object[]> getExpenseCategoryReport(
            @Param("user") User user);
}