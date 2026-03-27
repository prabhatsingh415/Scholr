package com.scholr.scholr.service;

import com.scholr.scholr.dto.SemesterRequest;
import com.scholr.scholr.entity.Semester;
import com.scholr.scholr.exception.SemesterAlreadyExistsException;
import com.scholr.scholr.repository.SemesterRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SemesterServiceImpl implements SemesterService{
    private final SemesterRepository repository;

    @Override
    public Semester findBySemesterNo(Integer semester) {
        return repository.findBySemesterNo(semester);
    }

    @Override
    public Optional<Semester> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Semester addSemester(SemesterRequest request) {
        if (repository.existsBySemesterNoAndYear(request.semesterNo(), request.year())) {
            throw new SemesterAlreadyExistsException("Semester " + request.semesterNo() + " for year " + request.year() + " already exists!");
        }

        Semester semester = new Semester();
        semester.setSemesterNo(request.semesterNo());
        semester.setYear(request.year());
        semester.setActive(true);

        return repository.save(semester);
    }

    @Override
    @Transactional
    public List<Semester> addSemestersBulk(List<SemesterRequest> requests) {
        return requests.stream()
                .map(this::addSemester)
                .toList();
    }

    @Override
    public List<Semester> findAll() {
        return repository.findAll();
    }

//    @Override
//    public void deleteById(Long id) {
//        repository.deleteById(id);
//    }
}

