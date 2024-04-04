package com.game.team1.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.game.team1.service.UserInfoService;
import com.game.team1.vo.MsgVO;
import com.game.team1.vo.UserInfoVO;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserInfoController {
    @Autowired
    private UserInfoService userService;

    @GetMapping("/user-infos")
    public List<UserInfoVO> getUserInfos(UserInfoVO user) {
        return userService.getUserInfos(user);
    }
    @GetMapping("/user-infos/{uiNum}")
    public UserInfoVO getUserInfo(@PathVariable int uiNum) {
        return userService.getUserInfo(uiNum);
    }
    @PostMapping("/login")
    public MsgVO login(@RequestBody UserInfoVO user, MsgVO msg, HttpSession session) {
        UserInfoVO loginUser = userService.login(user);
        msg.setMsg("아이디나 비밀번호를 확인하세요");
        if (loginUser != null) {
            session.setAttribute("user", loginUser);
            msg.setMsg("로그인이 성공하였습니다.");
            msg.setUrl("/");
            msg.setSuccess(true);
        }
        return msg;
    }
    @PostMapping("/user-infos")
    public MsgVO insertUserInfo(@RequestBody UserInfoVO user, MsgVO msg){
        try{
            int insertUserInfo = userService.insertUserInfo(user);
            if (insertUserInfo == 1) {
            msg.setMsg("회원가입이 성공하였습니다.");
            msg.setUrl("/");
            msg.setSuccess(true);
        }
        }catch(Exception e){
            msg.setMsg("회원가입이 실패했습니다.");
        }
        return msg;
    }
    @PutMapping("/user-infos")
    public int updateUserInfo(@RequestBody UserInfoVO user) {
        return userService.updateUserInfo(user);
    }
    @DeleteMapping("/user-infos/{uiNum}")
	public int deleteUserInfo(@PathVariable int uiNum) {
		log.info("uiNum=>{}", uiNum);
		return userService.deleteUserInfo(uiNum);
	}
}
