package com.expensemanager.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable =false)
    private String mobile;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean emailVerified = false;

    @Column(nullable = false)
    private boolean active = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String profileImage;

    @OneToMany(mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private java.util.List<Income> incomes;
    
    public User() {

    }
    
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Expense> expenses;
    
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Transaction> transactions;
    
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Budget> budgets;

	public User(Long id, String fullName, String email, String mobile, String password, boolean emailVerified,
			boolean active, LocalDateTime createdAt, String profileImage) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.mobile = mobile;
		this.password = password;
		this.emailVerified = emailVerified;
		this.active = active;
		this.createdAt = createdAt;
		this.profileImage = profileImage;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isEmailVerified() {
		return emailVerified;
	}

	public void setEmailVerified(boolean emailVerified) {
		this.emailVerified = emailVerified;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}
    
	public List<Income> getIncomes() {
	    return incomes;
	}

	public void setIncomes(List<Income> incomes) {
	    this.incomes = incomes;
	}

	public List<Expense> getExpenses() {
	    return expenses;
	}

	public void setExpenses(List<Expense> expenses) {
	    this.expenses = expenses;
	}
	
	public List<Transaction> getTransactions() {
	    return transactions;
	}

	public void setTransactions(List<Transaction> transactions) {
	    this.transactions = transactions;
	}
	
	public List<Budget> getBudgets() {
	    return budgets;
	}

	public void setBudgets(List<Budget> budgets) {
	    this.budgets = budgets;
	}
    
}