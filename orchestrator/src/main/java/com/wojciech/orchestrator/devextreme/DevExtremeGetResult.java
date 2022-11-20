package com.wojciech.orchestrator.devextreme;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DevExtremeGetResult<T> {
    List<T> data;
    int totalCount;
}
