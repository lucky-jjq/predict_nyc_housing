
import numpy as np


class IRR:
    def __init__(self, rentalPrice, numOfAmentity, unitCost):
        self.rentalPrice = rentalPrice*30*0.7 #daily rental price convert to monthly assume 70% occupancy
        self.unitCost = unitCost
        self.numOfAmentity = numOfAmentity
        self.operCost = 0
        self.year_irr = 0.0
        self.rental_income_stream = np.array([])
    
    def calcOperatingCost(self):
        addedCost = 0
        addedCost += 100 #electricity cost
        addedCost += self.unitCost*(0.02)/12.0 #Property maintainence fee
        addedCost += self.unitCost*(10.54*0.001)/12.0 #property tax - https://www.boston.gov/departments/assessing/how-we-tax-your-property
#         if 'wifi' in self.lstOfAmentity:
#             addedCost += 50 #wifi cost
#         if 'tv' in self.lstOfAmentity:
#             addedCost += 30 #cable cost
#         if 'washer' in self.lstOfAmentity or 'dryer' in self.lstOfAmentity:
#             addedCost += 15 #extra electricity
        otherCost = self.numOfAmentity*35.0
        return addedCost

    def calcIrr(self, initial_growth = 0.035, terminal_growth = 0.02, discount_rate = 0.04):
        '''
        Assumptions:
        Five near year growth rate = 0.035
        Terminal growth rate = 0.02
        Cost of capital = 0.04

        '''
        self.operCost = self.calcOperatingCost()
        
        rental_cf = [self.rentalPrice-self.operCost]*60
        rental_cf = [rental_cf[i]*(1+initial_growth)**i for i in range(len(rental_cf))]
        rental_cf.insert(0, -unitCost)
        try:
            terminal_val = rental_cf[-1]*(1+terminal_growth)/(discount_rate - terminal_growth)
        except ZeroDivisionError:
            terminal_val = rental_cf[-1]*(1+terminal_growth)/(0.04 - 0.02)
            print("Discount rate cannot be equal to the terminal growth rate, rendering division by 0 for terminal value.\nUse today's typical 30 year morgage rate and 2 percent terminal growth.")
        rental_cf.append(terminal_val)
        self.rental_income_stream = np.array(rental_cf)
        mont_irr = np.irr(np.array(rental_cf))
        year_irr = (1+mont_irr)**12.0 - 1
        self.year_irr = year_irr
        return year_irr


    def getAdvise(self):
        irr = self.calcIrr()
        if irr > 0:
            print('\nGreat News:')
            print('The annual irr for this unit valued at ${} is {:.1%} and its montly income and monthly operating cost is ${:2.1f} and ${:2.1f}'.format(self.unitCost, self.year_irr, self.rentalPrice, self.operCost))
        else:
            print('\nUnfortunately:')
            print('The annual irr for this unit valued at ${} is {:.1%} and its montly income and monthly operating cost is ${:2.1f} and ${:2.1f}'.format(self.unitCost, self.year_irr, self.rentalPrice, self.operCost))
            print('The rental unit might not worth it...')
    
    def writeToCsv(self):
        import pandas as pd
        unitCosts = [500000,600000,700000,800000,900000,1000000,1250000,1500000,1750000,2000000]
        df = pd.read_csv(r'C:\Users\junjq\OneDrive\Documents\prediction.csv')
        dfs = []
        for i in range(7): # in total, there are 6 types of amenities that is in the UI
            for c in unitCosts:
                df_new = df.copy()
                df_new['numOfAmenity'] = i
                df_new['unitCost'] = c
                dfs.append(df_new)
        df2 = pd.concat(dfs, axis = 0)
        df3 = df2.copy()
        df3.reset_index(drop=True,inplace=True)
        irrs = []
        for i in range(len(df3)):
            monthlyIncome = df3.loc[i,'predicted_price']
            numOfAmenity = df3.loc[i,'numOfAmenity']
            unitCost = df3.loc[i,'unitCost']
            i = IRR(monthlyIncome, numOfAmenity, unitCost)
            irr_num = i.calcIrr()
            if np.isnan(irr_num): irr_num = -0.5
            irrs.append(irr_num)
        df3['IRR'] = irrs
        df3.to_csv(r'C:\Users\junjq\OneDrive\Documents\prediction2.csv')
        
if __name__ == '__main__':
    #Scenerio 1
    unitCost = 1000000  #from UI
    monthlyIncome = 150 #from Model
    lstOfAmentity = ['Wifi', 'TV', 'washer'] #from UI
    numOfAmentity = len(lstOfAmentity)
    a = IRR(monthlyIncome, numOfAmentity, unitCost)
    a.calcIrr()
    a.getAdvise()