package com.scholr.scholr.service;

import com.scholr.scholr.entity.Department;
import com.scholr.scholr.entity.Semester;

public interface NotificationService {
    void sendQRNotification(Semester semester, Department department, String subjectName, Long sessionID);

}


