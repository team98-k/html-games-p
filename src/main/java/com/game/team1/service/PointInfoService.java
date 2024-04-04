package com.game.team1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.game.team1.mapper.PointInfoMapper;
import com.game.team1.vo.PointInfoVO;

@Service
public class PointInfoService {
    @Autowired
    private PointInfoMapper gameMapper;
	public List<PointInfoVO> getPointInfos(PointInfoVO game){
		return gameMapper.selectPointInfos(game);
	}
	public PointInfoVO getPointInfo(int uiNum) {
		return gameMapper.selectPointInfo(uiNum);
	}
	public int insertPointInfo(PointInfoVO game) {
		return gameMapper.insertPointInfo(game);
	}
	public int updatePointInfo(PointInfoVO game) {
		return gameMapper.updatePointInfo(game);
	}
	public int deletePointInfo( int uiNum) {
		return gameMapper.deletePointInfo(uiNum);
	}

}
