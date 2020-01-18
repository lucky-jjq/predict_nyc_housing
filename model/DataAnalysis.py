#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
import modules
"""
import pandas as pd
import statsmodels.api as sm


"""
This module defines the DataWrangling class
"""
class DataWrangling:
               
    # default constructor
    def __init__(self):
        pass
       
    # The importData method loads data from path
    # @param path where the data is stored
    # @return dataframe
    def importData(self, filePath):
        ds = pd.read_csv(filePath)
        return ds
    
    # The selectCols method selects a subset of columns 
    # @param dataframe
    # @param varlist
    # @return dataframe with a subset of columns
    def selectCols(self, dataframe, var_list):
        ds = dataframe[var_list]
        return ds
    
    # The strPrice_to_numPrice method converts USD prices from string to numeric format 
    # @param price_string 
    # @return price_numeric
    def strPrice_to_numPrice(self, price_string):
        price_numeric = float(str(price_string).replace(',', '').split('$')[-1])
        return price_numeric
    
    # The catRoom_to_dummyRoom method converts room type from categorical to dummies 
    # @param dataframe
    # @param room_var
    # @return dataframe with room type dummies
    def catRoom_to_dummyRoom(self, dataframe, room_var):
        room_dummy = pd.get_dummies(room_var)
        ds = pd.concat([dataframe, room_dummy], axis = 1)
        return ds
    
    # The deleteExremePrice method exclude extreme prices 
    # @param dataframe
    # @return dataframe that excludes extreme prices
    def deleteExremePrice(self, dataframe):
        lowerbound = 0
        upperBound = dataframe['price'].quantile(0.975)
        ds = dataframe[(dataframe['price'] > lowerbound) & (dataframe['price'] <= upperBound)]
        return ds


"""
This module defines the DataWrangling class
"""
class ModelBuilding:
    
    # default constructor
    def __init__(self):
        pass
    
    # The selectCols method selects a subset of columns 
    # @param dataframe
    # @param varlist
    # @return dataframe with a subset of columns
    def linearRegression(self, X, y):
        X_cons = sm.add_constant(X)
        model = sm.OLS(y, X_cons)
        result = model.fit()
        return result
    
    
"""
This module defines the Main method
"""
def Main():
     
    # create an object of class DataWrangling
    BDW = DataWrangling()
    
    # loads listings data
    boston0 = BDW.importData('/Users/mengphilshen/Dropbox/Project/Data_Challenges/Proj_Airbnb/data/Boston/Boston_listings.csv')
    
    # select a subset of columns
    var_list = ['price', 
                'security_deposit', 
                'cleaning_fee', 
                'extra_people',
                'accommodates',
                'bathrooms',
                'bedrooms',
                'beds',
                'guests_included',
                'minimum_nights',
                'maximum_nights',
                'availability_365',
                'reviews_per_month',
                'review_scores_rating',
                'host_listings_count',
                'host_is_superhost',
                'amenities',
                'neighbourhood_cleansed',
                'room_type']
    boston1 = BDW.selectCols(boston0, var_list)
    
    # converts USD prices from string to numeric format
    monetary_cols = ['price', 
                     'security_deposit', 
                     'cleaning_fee', 
                     'extra_people']
    for col in monetary_cols:
        boston1[col] = boston1[col].apply(BDW.strPrice_to_numPrice)
                
    # creates a series of area indicators
    far_south = ['Hyde Park', 'West Roxbury', 'Roslindale', 'Mattapan']
    middle_south = ['Jamaica Plain', 'Dorchester']
    near_south = ['Mission Hill', 'Fenway', 'Longwood Medical Area', 'Roxbury', 'South Boston', 'South End']
    west = ['Brighton', 'Allston']
    east = ['East Boston']
    north = ['Charlestown']
    center = ['Downtown', 'Beacon Hill', 'Leather District', 'Chinatown',
              'North End', 'West End', 'Bay Village', 'Back Bay', 'South Boston Waterfront']
    boston1['is_far_south'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in far_south))
    boston1['is_middle_south'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in middle_south))
    boston1['is_near_south'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in near_south))
    boston1['is_west'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in west))
    boston1['is_east'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in east))
    boston1['is_north'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in north))
    boston1['is_center'] =  boston1['neighbourhood_cleansed'].apply(lambda s: int(s in center))
    
    # converts room type from categorical to dummies 
    boston2 = BDW.catRoom_to_dummyRoom(boston1, boston1[['room_type']])
    
    # exclude extreme prices
    boston3 = BDW.deleteExremePrice(boston2)
    
    # delete missing values
    boston4 = boston3.dropna()
    
    # create the target vector
    price_var = ['price']
    y = BDW.selectCols(boston4, price_var)
    
    # create the features matrix
    feature_var = ['bathrooms', 
                   'bedrooms',
                   'room_type_Entire home/apt',
                   'room_type_Private room',                          
                   'is_middle_south', 
                   'is_near_south', 
                   'is_west', 
                   'is_east',
                   'is_north',
                   'is_center']
    X = BDW.selectCols(boston4, feature_var)
    
    # create an object of class ModelBuilding
    BMB = ModelBuilding()
    
    # fit the linear regression
    lr_result = BMB.linearRegression(X, y)
    print(lr_result.summary())
    
    # loads prediction data
    prediction_input = BDW.importData('/Users/mengphilshen/Dropbox/Project/Data_Challenges/Proj_Airbnb/data/Boston/prediction_input.csv')
    
    # make prediction
    lr_prediction = lr_result.predict(prediction_input)
    
    # write prediction data
    prediction_output = prediction_input.assign(predicted_price = lr_prediction)
    prediction_output.to_csv('/Users/mengphilshen/Dropbox/Project/Data_Challenges/Proj_Airbnb/data/Boston/prediction_output.csv')


"""
tell python that there is a Main method in the program 
"""  
if __name__ == '__main__':
    Main()
   
    
