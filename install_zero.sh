echo '----- Installing python dependencies -----'
python3 -m pip install -r requirements.txt

echo '\n\n----- Upgrading database -----'
flask db upgrade

echo '\n\n----- Installing app -----'
sudo python3 setup.py install