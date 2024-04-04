package com.game.team1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.game.team1.mapper.UserInfoMapper;
import com.game.team1.vo.UserInfoVO;

@Service
public class UserInfoService {
    @Autowired
    private UserInfoMapper userMapper;
	public List<UserInfoVO> getUserInfos(UserInfoVO user){
		return userMapper.selectUserInfos(user);
	}

	public UserInfoVO getUserInfo(int uiNum) {
		return userMapper.selectUserInfo(uiNum);
	}

    public UserInfoVO login(UserInfoVO user){
        return userMapper.selectUserInfoByIdAndPwd(user);
    }
	public int insertUserInfo(UserInfoVO user) {
		return userMapper.insertUserInfo(user);
	}
	public int updateUserInfo(UserInfoVO user) {
		return userMapper.updateUserInfo(user);
	}
	public int deleteUserInfo( int uiNum) {
		return userMapper.deleteUserInfo(uiNum);
	}

}
