<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::group(['middleware' => ['auth:api', 'cors']], function(){
    Route::post('/createAccount', 'AccountController@create');
    Route::post('/deleteAccount', 'AccountController@deleteAccount');
    Route::post('/createBudget', 'ExpenseItemController@createAll');
    Route::post('/updateExpense', 'ExpenseItemController@updateExpenseItem');
    Route::post('/updateBudget', 'ExpenseItemController@updateBudget');
    Route::post('/updateBudgetItem', 'ExpenseItemController@updateBudgetItem');
    Route::post('/deleteBudgetItem', 'ExpenseItemController@deleteBudgetItem');
    Route::post('/createIncomeItem', 'IncomeItemController@createItem');
    Route::post('/deleteIncomeItem', 'IncomeItemController@deleteItem');
});

Route::post('/register', 'ApiAuthenticationController@register');
Route::post('/login', 'ApiAuthenticationController@login');
