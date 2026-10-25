package com.campusconnect.dto;

public class ClubJoinRequest {

    private String reason;

    public ClubJoinRequest() {}

    public ClubJoinRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
