package com.scholr.scholr.service;


import com.scholr.scholr.dto.StudentRankingResponse;

import java.util.List;

public interface RankingService {
    List<StudentRankingResponse> getRankings(Long deptId, Integer year);
}

