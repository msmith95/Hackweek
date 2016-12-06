<?php

namespace App\Http\Controllers;

use App\Account;
use App\IncomeItem;
use Illuminate\Http\Request;

class IncomeItemController extends Controller
{
    /**
     * Creates new Income items for the user
     * @param Request $request
     * @return IncomeItem
     */
    public function createItem(Request $request){
        $user = $request->user();
        //$incomeItem = json_decode($request->input('incomeItem'), true);
        //$incomeItem = $request->input('incomeItem');
        $accountID = $request->input('accountID');
        $account = Account::findAccountById($user, $accountID);
        
        $incomeName = $request->input('incomeName');
        $incomeValue = $request->input('incomeValue');

        $incomeItem = new IncomeItem();
        $incomeItem->name = $incomeName;
        $incomeItem->income = $incomeValue;

        $account->incomeItems()->save($incomeItem);

        return $incomeItem;
    }

    /**
     * Deletes income items from a specific account
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function deleteItem(Request $request){
        $incomeID = $request->input('incomeID');
        $accountID = $request->input('accountID');
        $user = $request->user();

        $account = Account::findAccountById($user, $accountID);

        $incomeItem = $this->findIncomeItemById($account, $incomeID);
        if($incomeItem === null){
            return response('', 404);
        }
        $incomeItem->delete();
        return response('', 200);
    }

    /**
     * Finds an income item by id
     * @param $account
     * @param $incomeID
     */
    private function findIncomeItemById($account, $incomeID){
        $incomeItem = $account->incomeItems->first(function ($value, $key) use ($incomeID) {
            return $value->id == $incomeID;
        });
        return $incomeItem;
    }
}
