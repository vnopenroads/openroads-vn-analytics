import sys
sys.path.append(".")

from cba_server import create_app

app = create_app()

if __name__ == "__main__":
    app.run()