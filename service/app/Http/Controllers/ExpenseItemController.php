<?php

namespace App\Http\Controllers;

use App\Account;
use App\ExpenseItem;
use Illuminate\Http\Request;

class ExpenseItemController extends Controller
{
    /**
     * Creates all of the expense items sent from the site
     * @param Request $request
     * @return array
     */
    public function createAll(Request $request){
        $user = $request->user();
        $id = $request->input('accountID');
        $account = Account::findAccountById($user, $id);

        $items = $request->input('expenseItems');
        //$items = json_decode($items, true);
        $array = array();
        foreach($items as $item){
            $array[] = new ExpenseItem($item);
        }
        $account->expenseItems()->saveMany($array);

        return $array;
    }

    /**
     * Updates a specific expense items details
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function updateExpenseItem(Request $request){
        $accountID =  $request->input('accountID');
        $expenseID = $request->input('expenseID');
        $user = $request->user();
        $account = Account::findAccountById($user, $accountID);
        if($account !== null){
            $expenseItem = $this->findExpenseItemById($account, $expenseID);
            $expenseItem->spent = $request->input('spent');
            $expenseItem->remaining = $request->input('remaining');
            $expenseItem->save();
            return response('', 200);
        }else{
            return response('', 404);
        }
    }

    /**
     * Updates the budget after the user has made changes to it
     * @param Request $request
     * @return array
     */
    public function updateBudget(Request $request){
        $accountID = $request->input('accountID');
        $user = $request->user();
        //$budgetItems = collect(json_decode($request->input('budgetItems')));
        $budgetItems = collect($request->input('budgetItems'));
        $account = Account::findAccountById($user, $accountID);
        $expenseItems = $account->expenseItems;

        $currentItems = $this->findCurrentExpenseItems($expenseItems);
        $this->updateExpenseItemAndSave($currentItems, $budgetItems);

        $newItems = $this->findNewExpenseItems($budgetItems);
        $newItems = $this->createNewExpenseItems($newItems);

        $account->expenseItems()->saveMany($newItems);

        return array_values($newItems->toArray());
    }

    /**
     * Updates a specific budget item
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function updateBudgetItem(Request $request){
        $accountID = $request->input('accountID');
        $user = $request->user();
        $account = Account::findAccountById($user, $accountID);
        $expenseItemID = $request->input('expenseID');

        $expenseItem = $this->findExpenseItemById($account, $expenseItemID);
        $expenseItem->budgeted = $request->input('budgeted');

        return response('', 200);
    }

    /**
     * Deletes the requested budget item from the account
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function deleteBudgetItem(Request $request){
        $accountID = $request->input('accountID');
        $user = $request->user();
        $account = Account::findAccountById($user, $accountID);
        $expenseID = $request->input('expenseID');

        $expenseItem = $this->findExpenseItemById($account, $expenseID);
        if($expenseItem === null){
            return response('', 404);
        }
        $expenseItem->delete();
        return response('', 200);
    }

    /**
     * Finds an expense item by ID
     * @param $account - Account to be searched
     * @param $expenseID - ID of the expense item to find
     * @return mixed
     */
    private function findExpenseItemById($account, $expenseID){
        $expenseItem = $account->expenseItems->first(function ($value, $key) use ($expenseID) {
            return $value->id == $expenseID;
        });
        return $expenseItem;
    }

    /**
     * Returns expense items that have a non-null id
     * @param $expenseItems
     * @return mixed
     */
    private function findCurrentExpenseItems($expenseItems){
        $currentItems = $expenseItems->filter(function ($value, $key) {
            return $value['id'] != null;
        });
        return $currentItems;
    }

    /**
     * Finds expense items that have a null id
     * @param $expenseItems
     */
    private function findNewExpenseItems($expenseItems){
        $newItems = $expenseItems->filter(function ($value, $key) {
            return $value['id'] == null;
        });

        return $newItems;
    }

    /**
     * Updates the budget items with their new values and saves them in the database
     * @param $currentItems
     * @param $budgetItems
     */
    private function updateExpenseItemAndSave($currentItems, $budgetItems){
        $currentItems->transform(function ($item, $key) use ($budgetItems) {
            $bItem = $budgetItems->where('id', $item->id)->first();
            $item->budgeted = $bItem['budgeted'];
            $item->save();
            return $item;
        });
    }

    /**
     * Creates new expense items from an array
     * @param $newItems
     */
    private function createNewExpenseItems($newItems){
        $newItems = $newItems->transform(function ($item, $key) {
            return new ExpenseItem((array)$item);
        });

        return $newItems;
    }
}
