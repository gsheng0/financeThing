import { getFinancialInfo } from "./scraper"
import { FinancialData } from "./typedefs";

const main = async(ticker: string) => {
    const data: FinancialData = await getFinancialInfo(ticker);
    const year = new Date().getFullYear() - 1;
    const revenue = data["Revenue"][year];
    const ebit = data["Operating Income"][year]
    const taxRate = data["Effective Tax Rate"][year]
    const danda = data["Depreciation & Amortization"];
    const currentAssets = data["Total Assets"][year];
    const currentLiabilities = data["Total Liabilities"][year];
    // const nopat = ebit * (1 - taxRate);
}