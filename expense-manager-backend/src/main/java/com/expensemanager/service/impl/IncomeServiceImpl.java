package com.expensemanager.service.impl;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.expensemanager.dto.AddIncomeRequest;
import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.IncomeFilterRequest;
import com.expensemanager.dto.IncomeResponse;
import com.expensemanager.dto.IncomeSummaryResponse;
import com.expensemanager.dto.UpdateIncomeRequest;
import com.expensemanager.entity.Income;
import com.expensemanager.entity.User;
import com.expensemanager.enums.IncomeCategory;
import com.expensemanager.exception.ResourceNotFoundException;
import com.expensemanager.repository.IncomeRepository;
import com.expensemanager.repository.UserRepository;
import com.expensemanager.service.IncomeService;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.transaction.annotation.Transactional;

import com.expensemanager.entity.Transaction;
import com.expensemanager.enums.TransactionType;
import com.expensemanager.repository.TransactionRepository;

@Service
public class IncomeServiceImpl implements IncomeService {

	private final IncomeRepository incomeRepository;
	private final UserRepository userRepository;
	private final TransactionRepository transactionRepository;

	public IncomeServiceImpl(
	        IncomeRepository incomeRepository,
	        UserRepository userRepository,
	        TransactionRepository transactionRepository) {

	    this.incomeRepository = incomeRepository;
	    this.userRepository = userRepository;
	    this.transactionRepository = transactionRepository;
	}

    @Override
    public ApiResponse<IncomeResponse> addIncome(AddIncomeRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Income income = new Income();

        income.setTitle(request.getTitle());
        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());

        income.setUser(user);

        Income savedIncome =
                incomeRepository.save(income);

        /*
         * =========================================================
         * AUTOMATIC TRANSACTION CREATION
         * =========================================================
         */

        Transaction transaction = new Transaction();

        transaction.setTitle(savedIncome.getTitle());
        transaction.setAmount(savedIncome.getAmount());

        transaction.setType(
                TransactionType.INCOME);

        transaction.setTransactionDate(
                savedIncome.getIncomeDate());

        transaction.setDescription(
                savedIncome.getDescription());

        transaction.setUser(user);

        /*
         * Connect transaction to the original income.
         */
        transaction.setIncome(savedIncome);

        transactionRepository.save(transaction);


        /*
         * =========================================================
         * RESPONSE
         * =========================================================
         */

        IncomeResponse response = new IncomeResponse(
                savedIncome.getId(),
                savedIncome.getTitle(),
                savedIncome.getAmount(),
                savedIncome.getCategory(),
                savedIncome.getIncomeDate(),
                savedIncome.getDescription());

        return new ApiResponse<>(
                true,
                "Income added successfully.",
                response);
    }//end
    
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }//end
    
    @Override
    public ApiResponse<Page<IncomeResponse>> getAllIncome(
            int page,
            int size,
            String sortBy,
            String direction) {

        User user = getCurrentUser();

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Income> incomePage =
                incomeRepository.findAllByUser(user, pageable);

        Page<IncomeResponse> responsePage =
                incomePage.map(income ->
                        new IncomeResponse(
                                income.getId(),
                                income.getTitle(),
                                income.getAmount(),
                                income.getCategory(),
                                income.getIncomeDate(),
                                income.getDescription()
                        ));

        return new ApiResponse<>(
                true,
                "Income fetched successfully.",
                responsePage);
    }//end
    
    @Override
    public ApiResponse<IncomeResponse> getIncomeById(Long id) {

        User user = getCurrentUser();

        Income income =
                incomeRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Income not found."));

        IncomeResponse response =
                new IncomeResponse(

                        income.getId(),
                        income.getTitle(),
                        income.getAmount(),
                        income.getCategory(),
                        income.getIncomeDate(),
                        income.getDescription());

        return new ApiResponse<>(
                true,
                "Income fetched successfully.",
                response);
    }//end
    
    @Override
    public ApiResponse<IncomeResponse> updateIncome(
            Long id,
            UpdateIncomeRequest request) {

        User user = getCurrentUser();

        Income income =
                incomeRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Income not found."));

        income.setTitle(request.getTitle());
        income.setAmount(request.getAmount());
        income.setCategory(request.getCategory());
        income.setIncomeDate(request.getIncomeDate());
        income.setDescription(request.getDescription());

        Income updated =
                incomeRepository.save(income);
        
        /*
         * =========================================================
         * UPDATE RELATED TRANSACTION
         * =========================================================
         */

        transactionRepository
                .findByIncomeId(income.getId())
                .ifPresent(transaction -> {

                    transaction.setTitle(
                            income.getTitle());

                    transaction.setAmount(
                            income.getAmount());

                    transaction.setType(
                            TransactionType.INCOME);

                    transaction.setTransactionDate(
                            income.getIncomeDate());

                    transaction.setDescription(
                            income.getDescription());

                    transactionRepository.save(
                            transaction);
                });

        IncomeResponse response =
                new IncomeResponse(

                        updated.getId(),
                        updated.getTitle(),
                        updated.getAmount(),
                        updated.getCategory(),
                        updated.getIncomeDate(),
                        updated.getDescription());

        return new ApiResponse<>(
                true,
                "Income updated successfully.",
                response);
    }//end
    
    @Override
    public ApiResponse<Void> deleteIncome(Long id) {

        User user = getCurrentUser();

        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Income not found."));

        /*
         * =========================================================
         * DELETE RELATED TRANSACTION FIRST
         * =========================================================
         */

        transactionRepository
                .findByIncomeId(income.getId())
                .ifPresent(transaction -> {

                    transactionRepository.delete(
                            transaction);
                });

        /*
         * Now delete the actual income.
         */
        incomeRepository.delete(income);

        return new ApiResponse<>(
                true,
                "Income deleted successfully.",
                null);
    }//end
    
    @Override
    public ApiResponse<Page<IncomeResponse>> searchIncome(
            String keyword,
            int page,
            int size) {

        User user = getCurrentUser();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("incomeDate").descending());

        Page<Income> incomePage =
                incomeRepository
                        .findByUserAndTitleContainingIgnoreCase(
                                user,
                                keyword,
                                pageable);

        Page<IncomeResponse> responsePage =
                incomePage.map(income ->
                        new IncomeResponse(
                                income.getId(),
                                income.getTitle(),
                                income.getAmount(),
                                income.getCategory(),
                                income.getIncomeDate(),
                                income.getDescription()
                        ));

        return new ApiResponse<>(
                true,
                "Income search completed successfully.",
                responsePage);
    }//end
    
    @Override
    public ApiResponse<Page<IncomeResponse>> filterByCategory(
            IncomeCategory category,
            int page,
            int size) {

        User user = getCurrentUser();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("incomeDate").descending());

        Page<Income> incomePage =
                incomeRepository.findByUserAndCategory(
                        user,
                        category,
                        pageable);

        Page<IncomeResponse> responsePage =
                incomePage.map(income ->
                        new IncomeResponse(
                                income.getId(),
                                income.getTitle(),
                                income.getAmount(),
                                income.getCategory(),
                                income.getIncomeDate(),
                                income.getDescription()
                        ));

        return new ApiResponse<>(
                true,
                "Income filtered successfully.",
                responsePage);
    }//end
    
    @Override
    public ApiResponse<Page<IncomeResponse>> filterByDate(
            LocalDate from,
            LocalDate to,
            int page,
            int size) {

        if (from.isAfter(to)) {
            throw new IllegalArgumentException(
                    "From date cannot be after to date.");
        }

        User user = getCurrentUser();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by("incomeDate").descending());

        Page<Income> incomePage =
                incomeRepository.findByUserAndIncomeDateBetween(
                        user,
                        from,
                        to,
                        pageable);

        Page<IncomeResponse> responsePage =
                incomePage.map(income ->
                        new IncomeResponse(
                                income.getId(),
                                income.getTitle(),
                                income.getAmount(),
                                income.getCategory(),
                                income.getIncomeDate(),
                                income.getDescription()
                        ));

        return new ApiResponse<>(
                true,
                "Income filtered successfully.",
                responsePage);
    }//end
    
    @Override
    public ApiResponse<Page<IncomeResponse>> searchAndFilter(
            IncomeFilterRequest request) {

        if (request.getFrom() != null
                && request.getTo() != null
                && request.getFrom().isAfter(request.getTo())) {

            throw new IllegalArgumentException(
                    "From date cannot be after to date.");
        }

        User user = getCurrentUser();

        Sort sort;

        if ("desc".equalsIgnoreCase(request.getDirection())) {
            sort = Sort.by(request.getSortBy()).descending();
        } else {
            sort = Sort.by(request.getSortBy()).ascending();
        }

        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                sort);

        Page<Income> incomePage =
                incomeRepository.searchAndFilter(
                        user,
                        request.getKeyword(),
                        request.getCategory(),
                        request.getFrom(),
                        request.getTo(),
                        pageable);

        Page<IncomeResponse> responsePage =
                incomePage.map(income ->
                        new IncomeResponse(
                                income.getId(),
                                income.getTitle(),
                                income.getAmount(),
                                income.getCategory(),
                                income.getIncomeDate(),
                                income.getDescription()
                        ));

        return new ApiResponse<>(
                true,
                "Income filtered successfully.",
                responsePage);
    }//end
    
    @Override
    public ApiResponse<IncomeSummaryResponse> getMonthlySummary(
            int year,
            int month) {

        if (month < 1 || month > 12) {
            throw new IllegalArgumentException(
                    "Month must be between 1 and 12.");
        }

        User user = getCurrentUser();

        LocalDate from =
                LocalDate.of(year, month, 1);

        LocalDate to =
                from.withDayOfMonth(
                        from.lengthOfMonth());

        BigDecimal total =
                incomeRepository.getTotalIncomeBetween(
                        user,
                        from,
                        to);

        long count =
                incomeRepository.countIncomeBetween(
                        user,
                        from,
                        to);

        IncomeSummaryResponse response =
                new IncomeSummaryResponse(
                        total,
                        count);

        return new ApiResponse<>(
                true,
                "Monthly income summary fetched successfully.",
                response);
    }//end
    
    @Override
    public ApiResponse<IncomeSummaryResponse> getYearlySummary(
            int year) {

        User user = getCurrentUser();

        LocalDate from =
                LocalDate.of(year, 1, 1);

        LocalDate to =
                LocalDate.of(year, 12, 31);

        BigDecimal total =
                incomeRepository.getTotalIncomeBetween(
                        user,
                        from,
                        to);

        long count =
                incomeRepository.countIncomeBetween(
                        user,
                        from,
                        to);

        IncomeSummaryResponse response =
                new IncomeSummaryResponse(
                        total,
                        count);

        return new ApiResponse<>(
                true,
                "Yearly income summary fetched successfully.",
                response);
    }
}