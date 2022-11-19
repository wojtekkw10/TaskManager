window.jsPDF = window.jspdf.jsPDF;

var SERVICE_URL = "http://localhost:8080/tasks"

$(function() {
    const dataGrid = $("#taskDataGrid").dxDataGrid({
        dataSource: new DevExpress.data.CustomStore({
            key: "taskId",
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
                       console.log(response)
                           d.resolve(response.data, {
                               totalCount: response.totalCount,
                               //summary: response.summary,
                               //groupCount: response.groupCount
                           });
                       })
                       .fail(function() { throw "Data loading error" });
                   return d.promise();

               },

                        byKey: function(key) {
                            return $.getJSON(SERVICE_URL + "/" + encodeURIComponent(key));
                        },

                        insert: function(values) {
                            return $.post(SERVICE_URL, values);
                        },

                        update: function(key, values) {
                            return $.ajax({
                                url: SERVICE_URL + "/" + encodeURIComponent(key),
                                method: "PUT",
                                data: values
                            });
                        },

                        remove: function(key) {
                            return $.ajax({
                                url: SERVICE_URL + "/" + encodeURIComponent(key),
                                method: "DELETE",
                            });
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
        "taskName",
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