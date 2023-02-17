import { createRoot } from 'react-dom/client';
import './index.css';
import * as React from 'react';
import { PivotViewComponent, Inject, FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting, GroupingBar, VirtualScroll, DrillThrough, Grouping } from '@syncfusion/ej2-react-pivotview';
import * as dataSource from './pivot-data/universitydata.json';
import { updateSampleSection } from './sample-base';
import { select, createElement } from '@syncfusion/ej2-base';

/**
 * PivotView Toolbar Sample
 */
let UniversityData = dataSource.data;
let dataSourceSettings = {
    enableSorting: true,
    columns: [{ name: 'region', caption: 'Region' }, { name: 'country', caption: 'Country' }],
    rows: [{ name: 'rank_display', caption: 'Rank', expandAll: true, allowDragAndDrop: false },
        { name: 'university', caption: 'University', expandAll: true, allowDragAndDrop: false }],
    formatSettings: [{ name: 'international_students', format: 'N0' },
        { name: 'faculty_count', format: 'N0' }],
    dataSource: UniversityData,
    expandAll: false,
    values: [{ name: 'international_students', caption: 'Students' },
        { name: 'faculty_count', caption: 'Faculty' }],
    filters: [{ name: 'type', caption: 'University Type' }],
    filterSettings: [{ name: 'region', type: 'Exclude', items: ['Africa', 'Latin America'] }],
    fieldMapping: [{ name: 'rank_display', dataType: 'number' },
        { name: 'country', caption: 'Country' },
        { name: 'city', caption: 'City' },
        { name: 'region', caption: 'Region' },
        { name: 'research_output', caption: 'Research Output' },
        { name: 'student_faculty_ratio', caption: 'Student faculty ratio' }],
    groupSettings: [{ name: 'rank_display', type: 'Number', rangeInterval: 100 }],
    conditionalFormatSettings: [
        {
            measure: 'international_students',
            value1: 1,
            value2: 5000,
            conditions: 'Between',
            style: {
                backgroundColor: '#E10000',
                color: 'white',
                fontFamily: 'Tahoma',
                fontSize: '12px'
            },
            applyGrandTotals: false
        },
        {
            measure: 'international_students',
            value1: 50000,
            conditions: 'GreaterThan',
            style: {
                backgroundColor: '#0C860C',
                color: 'white',
                fontFamily: 'Tahoma',
                fontSize: '12px'
            },
            applyGrandTotals: false
        },
        {
            measure: 'faculty_count',
            value1: 1,
            value2: 1000,
            conditions: 'Between',
            style: {
                backgroundColor: '#E10000',
                color: 'white',
                fontFamily: 'Tahoma',
                fontSize: '12px'
            },
            applyGrandTotals: false
        },
        {
            measure: 'faculty_count',
            value1: 10000,
            conditions: 'GreaterThan',
            style: {
                backgroundColor: '#0C860C',
                color: 'white',
                fontFamily: 'Tahoma',
                fontSize: '12px'
            },
            applyGrandTotals: false
        }
    ],
    showHeaderWhenEmpty: false,
    emptyCellsTextContent: '-',
    excludeFields: ['link', 'logo']
};
function PivotToolbar() {
    React.useEffect(() => {
        updateSampleSection();
    }, []);
    let pivotObj;
    let toolbarOptions = ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
        'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'];
    function cellTemplate(args) {
        if (args.cellInfo && args.cellInfo.axis === 'value' && pivotObj.pivotValues[args.cellInfo.rowIndex] && pivotObj.pivotValues[args.cellInfo.rowIndex][0].hasChild) {
            if (args.targetCell.classList.contains(args.cellInfo.cssClass)) {
                args.targetCell.classList.remove(args.cellInfo.cssClass);
                args.cellInfo.style = undefined;
            }
        }
        if (args.cellInfo && args.cellInfo.axis === 'row' && args.cellInfo.valueSort.axis === 'university') {
            let imgElement = createElement('img', {
                className: 'university-logo',
                attrs: {
                    'src': UniversityData[args.cellInfo.index[0]].logo,
                    'alt': args.cellInfo.formattedText,
                    'width': '30',
                    'height': '30'
                },
            });
            let cellValue = select('.e-cellvalue', args.targetCell);
            cellValue.classList.add('e-hyperlinkcell');
            cellValue.addEventListener('click', hyperlinkCellClick.bind(pivotObj));
            args.targetCell.insertBefore(imgElement, cellValue);
        }
        return '';
    }
    function hyperlinkCellClick(args) {
        let cell = args.target.parentElement;
        let pivotValue = pivotObj.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('data-colindex'))];
        let link = UniversityData[pivotValue.index[0]].link;
        window.open(link, '_blank');
    }
    function saveReport(args) {
        let reports = [];
        let isSaved = false;
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reports = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.report && args.reportName && args.reportName !== '') {
            reports.map(function (item) {
                if (args.reportName === item.reportName) {
                    item.report = args.report;
                    isSaved = true;
                }
            });
            if (!isSaved) {
                reports.push(args);
            }
            localStorage.pivotviewReports = JSON.stringify(reports);
        }
    }
    function fetchReport(args) {
        let reportCollection = [];
        let reeportList = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item) { reeportList.push(item.reportName); });
        args.reportName = reeportList;
    }
    function loadReport(args) {
        let reportCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item) {
            if (args.reportName === item.reportName) {
                args.report = item.report;
            }
        });
        if (args.report) {
            pivotObj.dataSourceSettings = JSON.parse(args.report).dataSourceSettings;
        }
    }
    function removeReport(args) {
        let reportCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        for (let i = 0; i < reportCollection.length; i++) {
            if (reportCollection[i].reportName === args.reportName) {
                reportCollection.splice(i, 1);
            }
        }
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportCollection);
        }
    }
    function renameReport(args) {
        let reportsCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportsCollection = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.isReportExists) {
            for (let i = 0; i < reportsCollection.length; i++) {
                if (reportsCollection[i].reportName === args.rename) {
                    reportsCollection.splice(i, 1);
                }
            }
        }
        reportsCollection.map(function (item) { if (args.reportName === item.reportName) {
            item.reportName = args.rename;
        } });
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportsCollection);
        }
    }
    function newReport() {
        pivotObj.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
    }
    function beforeToolbarRender(args) {
        args.customToolbar.splice(6, 0, {
            type: 'Separator'
        });
        args.customToolbar.splice(9, 0, {
            type: 'Separator'
        });
    }
    function chartOnLoad(args) {
        let selectedTheme = location.hash.split("/")[1];
        selectedTheme = selectedTheme ? selectedTheme : "Material";
        args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).
            replace(/-dark/i, "Dark");
    }
    function chartSeriesCreated(args) {
        pivotObj.chartSettings.chartSeries.legendShape = pivotObj.chartSettings.chartSeries.type === 'Polar' ? 'Rectangle' : 'SeriesType';
    }
    return (<div className='control-pane'>
            <meta name="referrer" content="never"></meta>
            <div className='control-section' id='pivot-table-section' style={{ overflow: 'initial' }}>
                <div>
                    <PivotViewComponent id='PivotView' ref={(scope) => { pivotObj = scope; }} dataSourceSettings={dataSourceSettings} width={'100%'} height={'600'} showFieldList={true} exportAllPages={false} maxNodeLimitInMemberEditor={50} cellTemplate={cellTemplate.bind(this)} showGroupingBar={true} allowGrouping={true} enableVirtualization={true} enableValueSorting={true} allowDeferLayoutUpdate={true} allowDrillThrough={true} gridSettings={{
            columnWidth: 120, allowSelection: true, rowHeight: 36,
            selectionSettings: { mode: 'Cell', type: 'Multiple', cellSelectionMode: 'Box' }
        }} allowExcelExport={true} allowNumberFormatting={true} allowConditionalFormatting={true} allowPdfExport={true} showToolbar={true} allowCalculatedField={true} displayOption={{ view: 'Both' }} toolbar={toolbarOptions} newReport={newReport.bind(this)} renameReport={renameReport.bind(this)} removeReport={removeReport.bind(this)} loadReport={loadReport.bind(this)} fetchReport={fetchReport.bind(this)} saveReport={saveReport.bind(this)} toolbarRender={beforeToolbarRender.bind(this)} chartSettings={{ title: 'Top Universities Analysis', load: chartOnLoad.bind(this) }} chartSeriesCreated={chartSeriesCreated.bind(this)}>
                        <Inject services={[FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting, GroupingBar, Grouping, VirtualScroll, DrillThrough]}/>
                    </PivotViewComponent>
                </div>
                <div className='urllink'>
                    Source:
                    <a href="https://www.topuniversities.com/university-rankings?utm_source=topnav" target="_blank">QS World
                        University Rankings</a>
                </div>
            </div>

        </div>);
}
export default PivotToolbar;

const root = createRoot(document.getElementById('sample'));
root.render(<PivotToolbar />);