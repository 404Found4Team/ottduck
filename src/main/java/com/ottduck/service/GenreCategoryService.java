package com.ottduck.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ottduck.dto.GenreCategoryDTO;
import com.ottduck.mapper.GenreCategoryMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GenreCategoryService {

    private final GenreCategoryMapper genreCategoryMapper;

    public List<GenreCategoryDTO> getAllGenres() {
        return genreCategoryMapper.findAll();
    }
}
