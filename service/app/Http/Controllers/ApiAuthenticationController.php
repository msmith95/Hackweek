<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApiAuthenticationController extends Controller
{
    /**
     * Registers the new user and returns their details
     * @param Request $request
     * @return User
     */
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

    /**
     * Attempts to log in the user and responds with a 404 if unable to
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Symfony\Component\HttpFoundation\Response
     */
    public function login(Request $request){
        if(Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')])){
            return Auth::user();
        }else{
            return response('', 404);
        }
    }
}
