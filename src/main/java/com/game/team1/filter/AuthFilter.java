package com.game.team1.filter;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.filter.GenericFilterBean;

import com.game.team1.vo.UserInfoVO;

import lombok.extern.slf4j.Slf4j;

@WebFilter(value = { "/**", "/tmpl/*", "/api/*" })
@Slf4j
public class AuthFilter extends GenericFilterBean {
    // 인증을 건너뛸 URL 패턴의 목록
    private Set<String> excludeUrls = new HashSet<>() {
        {
            add("/tmpl/user-info/login");
            add("/tmpl/user-info/join");
            add("/");
        }
    };

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest && response instanceof HttpServletResponse) {
            HttpServletRequest req = (HttpServletRequest) request;
            HttpServletResponse res = (HttpServletResponse) response;
            String uri = req.getRequestURI();
            log.info("uri=>{}", uri);

            HttpSession session = req.getSession();
            UserInfoVO user = (UserInfoVO) session.getAttribute("user");

            if (user == null && !excludeUrls.contains(uri)) {
                // 세션에 사용자 정보가 없고, URL이 제외 목록에 없는 경우 로그인 페이지로 리디렉션
                res.sendRedirect("/tmpl/user-info/login");
                return;
            }
        }

        // 다음 필터 또는 요청 처리로 진행
        chain.doFilter(request, response);
    }
}
