/// Copyright (c) 2023, Sonos, Inc.  All rights reserved.

let perfcounter = {
    // entry function which actually generates two top level elements:
    // a <header> for the title and miscellaneous metadata and a <table> for the actual data

    generateTableForEach: function (id, counters) 
    {
        //clear old
        let div = document.getElementById(id);
        div.innerHTML = '';

        const captionText = document.createTextNode('Hover over each column header for a detailed description');
        div.appendChild(captionText);

        counters.forEach(counter => {
            this.generateTable(id, counter);
        });
    },

    generateTable: function (id, perfcounter) 
    {
        const div = document.getElementById(id);

        this.generateTableMetadata(perfcounter, div);

        const table = document.createElement('table');
        table.classList.add("purple");

        this.generateTableHeader(table, perfcounter);
        this.generateTableBody(table, perfcounter);
        div.appendChild(table);
    },

    // display the title and list metadata values (besides the counter metadata which is rendered as tooltips)
    generateTableMetadata: function (perfcounter, div)
    {
        const header = document.createElement('header');
        const heading = document.createElement('h2');
        const headingText = document.createTextNode(perfcounter.table);
        heading.appendChild(headingText);
        header.appendChild(heading);
        div.appendChild(header);

        // process the non-counters metadata
        const noncountersList = document.createElement('ul');

        const keys = Object.keys(perfcounter.metadata);
        for (const key of keys) {
            if (key != 'counters') {
                noncountersList.appendChild(this.createMetadataListItem(key, perfcounter.metadata[key]));
            }
        }

        div.appendChild(noncountersList);

        if (!perfcounter.metadata.counters.length) {
            heading.textContent += ' contains no counters';
        }
    },

    // This function populates the <thead> of the table including the tooltips of the header cells
    generateTableHeader: function(table, perfcounter)
    {
        const tableHead = document.createElement('thead');

        // we create two rows for the header cells because some counters have subcounters. The top is the name
        // of the counter, the bottom row contains the name of the subcounters. Simple counters (those without subcounters),
        // must span across both rows. Complex counters need to span across the number of subcounters they contain.
        const rowCounters = document.createElement('tr');
        const rowSubCounters = document.createElement('tr');

        for (let i = 0; i < perfcounter.metadata.counters.length; i++) {
            const counterMetadata = perfcounter.metadata.counters[i];
            // counterDataWindowZero won't be defined if there is no data in the table
            const counterDataWindowZero = perfcounter.data.length && perfcounter.data[0][counterMetadata.name];
            // if a display name is specified, use that, otherwise use name.
            const counterDisplayName = (counterMetadata.displayName ? counterMetadata.displayName : counterMetadata.name) +
                                       (counterMetadata.units ? ` (${counterMetadata.units})` : '');

            const headerCell = this.createHeaderCell(counterDisplayName, counterMetadata.description);

            // null check is needed here because simple counters sometimes initially set their value to 'null'
            // and typeof(null) evaluates to 'object' which we don't want. We only want to capture counters with subcounters
            const isComplexCounter = (counterDataWindowZero != null && typeof(counterDataWindowZero) == 'object');
            if (isComplexCounter) {
                // complex counters display as multiple columns so try to figure
                // how many columns to span
                headerCell.colSpan = Object.keys(counterDataWindowZero).length;

                // check if subcounters have metadata
                const hasSubCounterMetaData = counterMetadata.subcounters;

                if (hasSubCounterMetaData) {
                    for(const subcounter of counterMetadata.subcounters) {
                        const subCounterCellText = (subcounter.displayName || subcounter.name) +
                                             (subcounter.units ? ` (${subcounter.units})` : '');
                        const subCounterCell = this.createHeaderCell(subCounterCellText, subcounter.description || "", true);
                        rowSubCounters.appendChild(subCounterCell);
                    }
                } else {
                    for (const key in counterDataWindowZero) {
                        const subCounterCell = document.createElement('th');
                        const subCounterCellText = document.createTextNode(key);
                        subCounterCell.appendChild(subCounterCellText);
                        rowSubCounters.appendChild(subCounterCell);
                    }
                }
            } else {
                headerCell.rowSpan = 2;
            }

            rowCounters.appendChild(headerCell);
        }

        tableHead.appendChild(rowCounters);
        tableHead.appendChild(rowSubCounters);
        table.appendChild(tableHead);
    },

    // This function populates the <tbody> of the table with the data of each counter/subcounter
    generateTableBody: function(table, perfcounter)
    {
        const tableBody = document.createElement('tbody');

        // this will either be a number or undefined
        const windowDuration = perfcounter.metadata.windowDuration;

        for (let i = 0; i < perfcounter.data.length; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < perfcounter.metadata.counters.length; j++) {
                const countervalue = perfcounter.data[i][perfcounter.metadata.counters[j].name];

                // if table is historical, bold the border between time jumps
                let isTimeJump = false;
                if (windowDuration && i < perfcounter.data.length - 1) {
                    const timeGap = perfcounter.data[i].windowEndTime - perfcounter.data[i + 1].windowEndTime;
                    if (timeGap > windowDuration) {
                        isTimeJump = true;
                    }
                }

                // null check is needed here because simple counters sometimes initially set their value to 'null'
                // and typeof(null) evaluates to 'object' which we don't want. We only want to capture counters with subcounters
                const isComplexCounter = (countervalue != null && typeof(countervalue) == 'object');
                if (isComplexCounter) {
                    const keys = Object.keys(countervalue);

                    for (const key of keys) {
                        row.appendChild(this.createTableCell(countervalue[key], isTimeJump));
                    }
                }
                else {
                    row.appendChild(this.createTableCell(countervalue, isTimeJump));
                }
            }

            tableBody.appendChild(row);
        }

        table.appendChild(tableBody);
    },

    // helper function for creating a <th> header cell with a tooltip
    createHeaderCell: function(text, hoverText, subCounterCell = false)
    {
        const cell = document.createElement('th');
        cell.classList.add("cellWithTooltip");
        const cellText = document.createTextNode(text);
        cell.appendChild(cellText);

        const tooltip = document.createElement('span');
        tooltip.classList.add("cellTooltip");
        const tooltipText = document.createTextNode(hoverText);
        tooltip.appendChild(tooltipText);

        // if the cell is a subcounter, bump up the tooltip by an extra 25px
        // so that it won't overlap with the counter name
        if (subCounterCell) {
            tooltip.style.top = "-50px";
        }
    
        cell.appendChild(tooltip);

        return cell;
    },

    // helper function for creating a <td> data cell that displays empty for null values
    createTableCell: function(value, isTimeJump)
    {
        const cell = document.createElement('td');
        const cellText = document.createTextNode(value === null ? '' : value);
        cell.appendChild(cellText);
        if (isTimeJump) {
            cell.style.borderBottom = "thick solid #000000";
        }

        return cell;
    },

    // helper function for creating a <li> list item for the metadata list where the name of the
    // metadata is bold and they value is not
    createMetadataListItem: function(name, value)
    {
        const listItem = document.createElement('li');
        const bold = document.createElement('strong');

        const nameText = document.createTextNode(name);
        bold.appendChild(nameText);
        listItem.appendChild(bold);

        const valueText = document.createTextNode(': ' + value);
        listItem.appendChild(valueText);

        return listItem;
    }
}
