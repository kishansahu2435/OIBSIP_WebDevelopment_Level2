from pathlib import Path
import zipfile
out=Path('output')
zip_path=out/'swami_vivekananda_tribute.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for name in ['index.html','style.css','README.md']:
        z.write(out/name, arcname=name)
print(zip_path)