package com.campusconnect.repository;

import com.campusconnect.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundItemRepository extends JpaRepository<LostFoundItem, Long> {

    List<LostFoundItem> findByTypeIgnoreCaseOrderByDateReportedDesc(String type);

    List<LostFoundItem> findAllByOrderByDateReportedDesc();
}
