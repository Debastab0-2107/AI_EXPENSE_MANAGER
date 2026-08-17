package com.expensemanager;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ExpenseManagerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpenseManagerBackendApplication.class, args);
	}

}