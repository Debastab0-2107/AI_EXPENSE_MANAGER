

package com.expensemanager.service;

import com.expensemanager.dto.ApiResponse;
import com.expensemanager.dto.UserProfileResponse;

public interface UserService {

    ApiResponse<UserProfileResponse> getCurrentUser();
}