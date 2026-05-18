# 바이브코딩 가이드 사이트

이 폴더는 사이트 배포 전용 저장소 루트입니다.

`index.html`이 루트에 있으므로 GitHub Pages, Cloudflare Pages, Netlify 같은 정적 호스팅에 바로 올릴 수 있습니다.

## 배포 구조

```
site-repo/
├── index.html
├── assets/
├── chapters/
├── screenshots/
└── .nojekyll
```

## 배포 설정

GitHub Pages를 쓸 때:

- Source: `main` branch
- Folder: `/root`

Cloudflare Pages를 쓸 때:

- Framework preset: `None`
- Build command: 비워두기
- Output directory: `/`

## 처음 저장소에 올릴 때

```bash
git add .
git commit -m "init: 바이브코딩 가이드 사이트"
git branch -M main
git remote add origin <새 GitHub 저장소 URL>
git push -u origin main
```

## 원본 위치

원본 편집 위치는 `../guide-site/`입니다.

수정 후 이 배포 루트를 다시 맞추려면 프로젝트 루트에서 아래 명령을 실행합니다.

```powershell
.\scripts\sync-site-repo.cmd
```
