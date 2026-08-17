package com.expensemanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensemanager.dto.ApiResponse;

@RestController
public class HomeController {

    @GetMapping("/")
    public ApiResponse<String> home() {

        return new ApiResponse<>(
                true,
                "Expense Manager Backend Running Successfully",
                "Welcome");

    }

}