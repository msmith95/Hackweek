<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class ApiAuthenticationController extends Controller
{
    public function register(Request $request){
        $this->validate($request, [
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        return User::create([
            'email' => $request->input("email"),
            'password' => bcrypt($request->input("password")),
            'api_token' => str_random(48)
        ]);
    }
}