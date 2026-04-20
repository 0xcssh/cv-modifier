import logging

import resend

from app.config import settings

logger = logging.getLogger(__name__)


BASE_STYLE = """
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background: #f8fafc; }
  .container { max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .header { background: #1e293b; padding: 28px 32px; }
  .logo { color: white; font-size: 22px; font-weight: bold; text-decoration: none; }
  .logo .accent { color: #60a5fa; }
  .content { padding: 40px 32px; color: #334155; line-height: 1.6; }
  h1 { color: #0f172a; font-size: 24px; margin: 0 0 16px; }
  p { margin: 0 0 16px; }
  .btn { display: inline-block; background: #2563eb; color: white !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
  .btn:hover { background: #1d4ed8; }
  .footer { padding: 24px 32px; background: #f8fafc; color: #94a3b8; font-size: 13px; text-align: center; }
  .muted { color: #94a3b8; font-size: 14px; }
</style>
"""


def _wrap(content_html: str, title: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>{title}</title>
  {BASE_STYLE}
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">CV <span class="accent">Modifier</span></span>
    </div>
    <div class="content">
      {content_html}
    </div>
    <div class="footer">
      CV Modifier — Adaptez votre CV en 30 secondes<br>
      <span class="muted">Cet email vous a été envoyé par CV Modifier. Si vous n'êtes pas à l'origine de cette demande, vous pouvez l'ignorer.</span>
    </div>
  </div>
</body>
</html>"""


def _send(to: str, subject: str, html: str) -> None:
    if not settings.resend_api_key:
        logger.warning(f"RESEND_API_KEY not set — email to {to} skipped ({subject})")
        return

    resend.api_key = settings.resend_api_key
    try:
        resend.Emails.send({
            "from": settings.email_from,
            "to": to,
            "subject": subject,
            "html": html,
        })
        logger.info(f"Email sent to {to}: {subject}")
    except Exception as e:
        logger.exception(f"Failed to send email to {to}: {e}")


def send_welcome_email(to: str) -> None:
    html = _wrap(
        f"""
        <h1>Bienvenue sur CV Modifier ! 🎉</h1>
        <p>Votre compte a été créé avec succès.</p>
        <p>Vous avez <strong>3 crédits gratuits</strong> pour commencer à générer des CV adaptés à chaque offre d'emploi.</p>
        <p>Pour démarrer :</p>
        <ol>
          <li>Uploadez votre CV actuel (l'IA extraira automatiquement vos informations)</li>
          <li>Collez le lien d'une offre d'emploi</li>
          <li>Recevez un CV + lettre de motivation parfaitement adaptés</li>
        </ol>
        <a href="{settings.frontend_url}/dashboard/generate" class="btn">Générer mon premier CV</a>
        <p class="muted">Besoin d'aide ? Répondez simplement à cet email.</p>
        """,
        "Bienvenue sur CV Modifier",
    )
    _send(to, "Bienvenue sur CV Modifier 🚀", html)


def send_verification_email(to: str, token: str) -> None:
    link = f"{settings.frontend_url}/verify?token={token}"
    html = _wrap(
        f"""
        <h1>Confirmez votre adresse email</h1>
        <p>Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte CV Modifier.</p>
        <a href="{link}" class="btn">Confirmer mon email</a>
        <p class="muted">Ou copiez ce lien dans votre navigateur :</p>
        <p class="muted" style="word-break: break-all;">{link}</p>
        <p class="muted">Ce lien expire dans 1 heure.</p>
        """,
        "Confirmez votre email",
    )
    _send(to, "Confirmez votre email — CV Modifier", html)


def send_reset_password_email(to: str, token: str) -> None:
    link = f"{settings.frontend_url}/reset-password?token={token}"
    html = _wrap(
        f"""
        <h1>Réinitialiser votre mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe CV Modifier.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <a href="{link}" class="btn">Réinitialiser mon mot de passe</a>
        <p class="muted">Ou copiez ce lien dans votre navigateur :</p>
        <p class="muted" style="word-break: break-all;">{link}</p>
        <p class="muted">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        """,
        "Réinitialiser votre mot de passe",
    )
    _send(to, "Réinitialisation de votre mot de passe — CV Modifier", html)
