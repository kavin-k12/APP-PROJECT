package com.campusconnect.dto;

/**
 * Java Lab Module DTO for REST catalog endpoint.
 */
public class JavaLabModuleDTO {

    private String id;
    private String name;
    private String category;
    private String description;
    private String filePath;
    private String fileName;
    private String endpoint;
    private String javaCode;
    private String pseudocode;
    private String explanation;

    public JavaLabModuleDTO() {}

    public JavaLabModuleDTO(String id, String name, String category, String description, String filePath, String fileName, String endpoint, String javaCode, String pseudocode, String explanation) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.filePath = filePath;
        this.fileName = fileName;
        this.endpoint = endpoint;
        this.javaCode = javaCode;
        this.pseudocode = pseudocode;
        this.explanation = explanation;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public String getJavaCode() { return javaCode; }
    public void setJavaCode(String javaCode) { this.javaCode = javaCode; }

    public String getPseudocode() { return pseudocode; }
    public void setPseudocode(String pseudocode) { this.pseudocode = pseudocode; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
