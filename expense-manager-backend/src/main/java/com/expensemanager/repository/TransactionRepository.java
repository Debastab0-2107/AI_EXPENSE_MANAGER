package com.expensemanager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.expensemanager.entity.Transaction;
import com.expensemanager.entity.User;
import com.expensemanager.enums.TransactionType;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUser(
            Long id,
            User user);

    Page<Transaction> findAllByUser(
            User user,
            Pageable pageable);

    Page<Transaction> findAllByUserAndType(
            User user,
            TransactionType type,
            Pageable pageable);

    Page<Transaction> findAllByUserAndTransactionDateBetween(
            User user,
            LocalDate from,
            LocalDate to,
            Pageable pageable);

    /*
     * =========================================================
     * FIND TRANSACTION FROM SOURCE
     * =========================================================
     */

    Optional<Transaction> findByIncomeId(
            Long incomeId);

    Optional<Transaction> findByExpenseId(
            Long expenseId);

    /*
     * =========================================================
     * TOTALS
     * =========================================================
     */

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM Transaction t
            WHERE t.user = :user
            AND t.type = :type
            """)
    BigDecimal getTotalByType(
            @Param("user") User user,
            @Param("type") TransactionType type);
}