package com.expensemanager.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.expensemanager.entity.Budget;
import com.expensemanager.entity.User;
import com.expensemanager.enums.BudgetCategory;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    List<Budget> findAllByUserOrderByYearDescMonthDesc(
            User user);

    Optional<Budget> findByIdAndUser(
            Long id,
            User user);

    Optional<Budget> findByUserAndCategoryAndMonthAndYear(
            User user,
            BudgetCategory category,
            int month,
            int year);

    List<Budget> findAllByUserAndMonthAndYear(
            User user,
            int month,
            int year);
    
    @Query("""
            SELECT COALESCE(SUM(b.amount), 0)
            FROM Budget b
            WHERE b.user = :user
            AND b.month = :month
            AND b.year = :year
            """)
    BigDecimal getTotalBudgetForMonth(
            @Param("user") User user,
            @Param("month") int month,
            @Param("year") int year);
}