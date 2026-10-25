package com.campusconnect.service;

import com.campusconnect.dto.LostFoundRequest;
import com.campusconnect.entity.LostFoundItem;
import com.campusconnect.entity.Student;
import com.campusconnect.repository.LostFoundItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class LostFoundService {

    private final LostFoundItemRepository itemRepository;

    public LostFoundService(LostFoundItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<LostFoundItem> getItems(String type) {
        if (type != null && !type.isBlank()) {
            return itemRepository.findByTypeIgnoreCaseOrderByDateReportedDesc(type);
        }
        return itemRepository.findAllByOrderByDateReportedDesc();
    }

    @Transactional
    public LostFoundItem reportItem(LostFoundRequest request, Student reporter) {
        LostFoundItem item = new LostFoundItem();
        item.setTitle(request.getTitle().trim());
        item.setDescription(request.getDescription().trim());
        item.setCategory(request.getCategory());
        item.setType(request.getType().toUpperCase());
        item.setLocation(request.getLocation().trim());
        item.setStatus("OPEN");
        item.setDateReported(LocalDate.now());
        item.setReporter(reporter);

        return itemRepository.save(item);
    }
}
