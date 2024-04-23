import { getFinancialInfo } from "./scraper"

const main = async(ticker: string) => {
    const data: FinancialData = await getFinancialInfo(ticker);
    const revenue = data.Revenue;
}