package com.mezon.backend.security;

import com.mezon.backend.entity.AuditLog;
import com.mezon.backend.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @AfterReturning(pointcut = "@annotation(auditable)", returning = "result")
    public void logAudit(JoinPoint joinPoint, Auditable auditable, Object result) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return;
            }

            Long userId = null;
            String username = auth.getName();

            if (auth.getPrincipal() instanceof AuthenticatedUserPrincipal principal) {
                userId = principal.id();
                username = principal.username();
            }

            String targetType = joinPoint.getTarget().getClass().getSimpleName()
                    .replace("Controller", "")
                    .replace("Service", "");

            String targetId = null;
            Object[] args = joinPoint.getArgs();
            if (args != null && args.length > 0 && args[0] instanceof Long id) {
                targetId = String.valueOf(id);
            }

            AuditLog log = new AuditLog();
            log.setUserId(userId);
            log.setUsername(username);
            log.setAction(auditable.action());
            log.setTargetType(targetType);
            log.setTargetId(targetId);
            log.setDetail(null);
            log.setCreatedAt(null);

            auditLogRepository.save(log);
        } catch (Exception ignored) {
            // Never let audit logging break business logic
        }
    }
}
