package com.smarthome.common;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String resource) {
        super(resource + " was not found.");
    }
}