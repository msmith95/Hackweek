<?php

namespace App\Http\Controllers;

use App\Account;
use App\ExpenseItem;
use Illuminate\Http\Request;

class ExpenseItemController extends Controller
{
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


    public function updateBudgetItem(Request $request){
        $accountID = $request->input('accountID');
        $user = $request->user();
        $account = Account::findAccountById($user, $accountID);
        $expenseItemID = $request->input('expenseID');

        $expenseItem = $this->findExpenseItemById($account, $expenseItemID);
        $expenseItem->budgeted = $request->input('budgeted');

        return response('', 200);
    }

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

    private function findExpenseItemById($account, $expenseID){
        $expenseItem = $account->expenseItems->first(function ($value, $key) use ($expenseID) {
            return $value->id == $expenseID;
        });
        return $expenseItem;
    }

    private function findCurrentExpenseItems($expenseItems){
        $currentItems = $expenseItems->filter(function ($value, $key) {
            return $value['id'] != null;
        });
        return $currentItems;
    }

    /**
     * @param $expenseItems
     */
    private function findNewExpenseItems($expenseItems){
        $newItems = $expenseItems->filter(function ($value, $key) {
            return $value['id'] == null;
        });

        return $newItems;
    }

    /**
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
     * @param $newItems
     */
    private function createNewExpenseItems($newItems){
        $newItems = $newItems->transform(function ($item, $key) {
            return new ExpenseItem((array)$item);
        });

        return $newItems;
    }
}
