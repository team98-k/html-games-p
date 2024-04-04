package com.game.team1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.game.team1.mapper.GameInfoMapper;
import com.game.team1.vo.GameInfoVO;

@Service
public class GameInfoService {
    @Autowired
    private GameInfoMapper gameMapper;
	public List<GameInfoVO> getGameInfos(GameInfoVO game){
		return gameMapper.selectGameInfos(game);
	}
	public GameInfoVO getGameInfo(int uiNum) {
		return gameMapper.selectGameInfo(uiNum);
	}
	public int insertGameInfo(GameInfoVO game) {
		return gameMapper.insertGameInfo(game);
	}
	public int updateGameInfo(GameInfoVO game) {
		return gameMapper.updateGameInfo(game);
	}
	public int deleteGameInfo( int uiNum) {
		return gameMapper.deleteGameInfo(uiNum);
	}

}
