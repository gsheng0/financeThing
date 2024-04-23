import axios from 'axios';
import { parse } from 'parse5';

const fetchFinancialData = async(ticker: string) => {
    const result = await axios.get(`https://stockanalysis.com/stocks/${ticker}/financials/`)
    return parse(result.data);
}

const fetchBalanceSheetData = async(ticker: string) => {
    const result = await axios.get(`https://stockanalysis.com/stocks/${ticker}/financials/balance-sheet/`)
    return parse(result.data);
}

const fetchCashFlowData = async(ticker: string) => {
    const result = await axios.get(`https://stockanalysis.com/stocks/${ticker}/financials/cash-flow-statement/`);
    return parse(result.data);
}

const fetchFinVizData = async(ticker: string) => {
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
      };
      
    try {
        const result = await axios.get(`https://finviz.com/quote.ashx?t=${ticker}&p=d`, { headers });
        return parse(result.data);  
    } catch (error) {
        console.error(error);
    }
    
}

export const scrapeFinVizData = async(ticker: string) => {
    const document = await fetchFinVizData(ticker);
    const traverse = (node: any, callback: Function) => {
		if (node.childNodes) {
			for (const childNode of node.childNodes) {
				traverse(childNode, callback);
			}
		}
		callback(node);
	};

	const tableClassName = 'js-snapshot-table snapshot-table2 screener_snapshot-table-body'; // Replace 'example-table' with the actual class name of the table
	let table: string[][] = [];

	traverse(document, (node: any) => {
		if (node.tagName === 'table' && node.attrs) {
			const classAttr = node.attrs.find((attr: any) => attr.name === 'class');
			if (classAttr && classAttr.value === tableClassName) {
				node.childNodes.forEach((childNode: any) => {
					if (childNode.tagName === 'tbody') {
						childNode.childNodes.forEach((rowNode: any) => {
							if (rowNode.tagName === 'tr') {
								const row: string[] = [];
								rowNode.childNodes.forEach((cellNode: any) => {
									if (cellNode.tagName === 'td') {
										if(cellNode.childNodes[0].value === undefined){
                                            if(cellNode.childNodes[0].childNodes[0].value === undefined){
                                                row.push(cellNode.childNodes[0].childNodes[0].childNodes[0].value);
                                            } else{
                                                row.push(cellNode.childNodes[0].childNodes[0].value);
                                            }
                                            
                                        } else{
                                            row.push(cellNode.childNodes[0].value);
                                        }
									}
								});
								table.push(row);
							}
						});
					}
				});
			}
		}
	});
    console.log(table);
	return table;

}

export const scrapeTableData = async (document: any) => {
	const traverse = (node: any, callback: Function) => {
		if (node.childNodes) {
			for (const childNode of node.childNodes) {
				traverse(childNode, callback);
			}
		}
		callback(node);
	};

	const tableClassName = 'w-full border-separate border-spacing-0 whitespace-nowrap'; // Replace 'example-table' with the actual class name of the table
	let table: string[][] = [];

	traverse(document, (node: any) => {
		if (node.tagName === 'table' && node.attrs) {
			const classAttr = node.attrs.find((attr: any) => attr.name === 'class');
			if (classAttr && classAttr.value === tableClassName) {
				node.childNodes.forEach((childNode: any) => {
					if (childNode.tagName === 'tbody') {
						childNode.childNodes.forEach((rowNode: any) => {
							if (rowNode.tagName === 'tr') {
								const row: string[] = [];
								rowNode.childNodes.forEach((cellNode: any) => {
									if (cellNode.tagName === 'td') {
										let found: boolean = false;
										for (let i: number = 0; i < cellNode.childNodes.length; i++) {
											if (cellNode.childNodes[i].tagName == 'span') {
												row.push(cellNode.childNodes[i].childNodes[0].value);
												found = true;
											}
										}
										if (!found) {
											row.push(cellNode.childNodes[0].value);
										}
									}
								});
								table.push(row);
							}
						});
					} else if(childNode.tagName === 'thead'){
                        const row: string[] = [];
                        for(let i = 0; i < childNode.childNodes.length; i++){
                            for(let x = 0; childNode.childNodes[i] !== undefined && x < childNode.childNodes[i].childNodes.length - 1; x++){
                                if(childNode.childNodes[i].childNodes[x].childNodes === undefined){
                                    continue;
                                }
                                row.push(childNode.childNodes[i].childNodes[x].childNodes[0].value);
                            }
                            
                        }
                        table.push(row);
                    }
				});
			}
		}
	});
	return table;
};

const main = async(ticker: string) => {
    const obj: any = {};
    const cashFlowTable: string[][] = await scrapeTableData(await fetchCashFlowData(ticker));
    const incomeTable: string[][] = await scrapeTableData(await fetchFinancialData(ticker));
    const balanceSheetTable: string[][] = await scrapeTableData(await fetchBalanceSheetData(ticker));
    addInfoToObj(obj, cashFlowTable);
    addInfoToObj(obj, incomeTable);
    addInfoToObj(obj, balanceSheetTable);

    // console.log(obj);
}
const addInfoToObj = (obj: any, infoTable: string[][]) => {
    const years = infoTable[0];
    for(let i = 1; i < infoTable.length; i++){
        const rowName: string = infoTable[i][0];
        if(rowName === undefined){
            continue;
        }
        obj[rowName] = {};
        for(let x = 1; x < years.length; x++){
            obj[rowName][years[x]] = infoTable[i][x];
        }
    }

}

// main("tsla");
scrapeFinVizData("tsla");
