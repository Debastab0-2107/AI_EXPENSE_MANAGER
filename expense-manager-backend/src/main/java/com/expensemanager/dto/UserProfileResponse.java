package com.expensemanager.dto;

public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String mobile;
    private String profileImage;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id,
                               String fullName,
                               String email,
                               String mobile,
                               String profileImage) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
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

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}