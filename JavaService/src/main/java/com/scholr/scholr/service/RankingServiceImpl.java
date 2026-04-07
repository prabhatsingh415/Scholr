package com.scholr.scholr.service;

import com.scholr.scholr.dto.StudentRankingResponse;
import com.scholr.scholr.entity.Student;
import com.scholr.scholr.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {

    private final StudentRepository studentRepository;

    @Override
    public List<StudentRankingResponse> getRankings(Long deptId, Integer academicYear) {
        // Fetch students based on optional filters
        List<Student> students = studentRepository.findRankings(deptId, academicYear);

        // Ranking Logic
        return IntStream.range(0, students.size())
                .mapToObj(i -> {
                    Student s = students.get(i);
                    return new StudentRankingResponse(
                            i + 1,
                            s.getFirstName() + " " + s.getLastName(),
                            s.getCollegeId(),
                            s.getCgpa(),
                            s.getDepartment().getDeptName(),
                            s.getSemester().getSemesterNo(),
                            s.getSemester().getYear()
                    );
                })
                .collect(Collectors.toList());
    }
}