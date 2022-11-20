window.jsPDF = window.jspdf.jsPDF;

var SERVICE_URL = "http://localhost:8080/tasks"

$(function() {
    const dataGrid = $("#taskDataGrid").dxDataGrid({
        dataSource: new DevExpress.data.CustomStore({
            key: "id",
               load: function(loadOptions) {
                var d = $.Deferred();
                var params = {};
                [
                   "filter",
                   "group",
                   "groupSummary",
                   "parentIds",
                   "requireGroupCount",
                   "requireTotalCount",
                   "searchExpr",
                   "searchOperation",
                   "searchValue",
                   "select",
                   "sort",
                   "skip",
                   "take",
                   "totalSummary",
                   "userData"
                ].forEach(function(i) {
                   if(i in loadOptions && isNotEmpty(loadOptions[i])) {
                       params[i] = JSON.stringify(loadOptions[i]);
                   }
                })

                $.getJSON(SERVICE_URL, params)
                   .done(function(response) {
                       d.resolve(response.data, {
                           totalCount: response.totalCount,
                           //summary: response.summary,
                           //groupCount: response.groupCount
                       });
                   })
                   .fail(function() { throw "Data loading error" });
                return d.promise();

                },

                byKey: function (key) {
                        var d = new $.Deferred();
                        $.get(SERVICE_URL + "?id=" + key)
                            .done(function (dataItem) {
                                d.resolve(dataItem);
                            });
                        return d.promise();
                },

                insert: function(values) {
                        var deferred = $.Deferred();
                        $.ajax({
                            url: SERVICE_URL + "/insert",
                            method: "POST",
                            data: JSON.stringify(values),
                            contentType: "application/json"
                        })
                        .done(deferred.resolve)
                        .fail(function(e){
                            deferred.reject("Insertion failed");
                        });
                        return deferred.promise();
                    },
                    remove: function(key) {
                        var deferred = $.Deferred();
                        $.ajax({
                            url: SERVICE_URL + "/delete/" + encodeURIComponent(key),
                            method: "DELETE"
                        })
                        .done(deferred.resolve)
                        .fail(function(e){
                            deferred.reject("Deletion failed");
                        });
                        return deferred.promise();
                    },
                    update: function(key, values) {
                        var deferred = $.Deferred();
                        $.ajax({
                            url: SERVICE_URL + "/update/" + encodeURIComponent(key),
                            method: "PUT",
                            data: JSON.stringify(values),
                            contentType: "application/json"
                        })
                        .done(deferred.resolve)
                        .fail(function(e){
                            deferred.reject("Update failed");
                        });
                        return deferred.promise();
                    }
                }),
        allowColumnResizing: true,
        columnAutoWidth: true,
        columnFixing: {
            enabled: true
        },
        requireTotalCount: true,
        allowColumnReordering: true,
        columnChooser: { enabled: true },
        columns: [
        "taskDescription",
        "taskCategory"
        ],
        filterRow: { visible: true },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        selection: { mode: "single" },
        summary: {
            groupItems: [{
                summaryType: "count"
            }]
        },
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: "Collapse All",
                        width: 136,
                        onClick(e) {
                            const expanding = e.component.option("text") === "Expand All";
                            dataGrid.option("grouping.autoExpandAll", expanding);
                            e.component.option("text", expanding ? "Collapse All" : "Expand All");
                        },
                    },
                },
                {
                    name: "addRowButton",
                    showText: "always"
                },
                "exportButton",
                "columnChooserButton",
                "searchPanel"
            ]
        },
        export: {
            enabled: true,
            formats: ['xlsx', 'pdf']
        },
        onExporting(e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Main sheet");
                DevExpress.excelExporter.exportDataGrid({
                    worksheet: worksheet,
                    component: e.component,
                }).then(function() {
                    workbook.xlsx.writeBuffer().then(function(buffer) {
                        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Tasks.xlsx");
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Tasks.pdf');
                });
            }
        }
    }).dxDataGrid("instance");
});

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== "";
}