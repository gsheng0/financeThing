import axios from 'axios';
import { parse } from 'parse5';

const fetchData = async () => {
	const result = await axios.get('https://stockanalysis.com/stocks/tsla/financials/');
	const out = parse(result.data);
	return out;
};

const fetchFinancialData = async(ticker: string) => {
    const result = await axios.get(`https://stockanalysis.com/stocks/${ticker}/financials/`)
    return parse(result.data);
}

const fetchBalanceSheetData = async(ticker: string) => {
    const result = await axios.get(`https://stockanalysis.com/stocks/${ticker}/financials/balance-sheet/`)
    return parse(result.data);
}



export const scrapeFinancialData = async (ticker: string) => {
	const document = await fetchFinancialData(ticker);
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
					}
				});
			}
		}
	});
	return table;
};

scrapeFinancialData("TSLA");
