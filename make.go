package main

import (
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

func main() {
	verifyRoot()

	if exit := run("hugo"); exit != 0 {
		log.Fatalf("hugo failed: %v\n", exit)
	}

	if exit := run("git", "checkout", "gh-pages"); exit != 0 {
		log.Fatalf("failed to checkout gh-pages: %v\n", exit)
	}

	// Delete everything except the ./public folder.
	entries, err := ioutil.ReadDir(".")
	if err != nil {
		log.Fatalln(err)
	}
	for _, entry := range entries {
		if entry.IsDir() &&
			(entry.Name() == "public" || entry.Name() == ".git") {
			continue
		}

		err := os.RemoveAll(entry.Name())
		if err != nil {
			log.Fatalln(err)
		}
	}

	moveFile("./public/post/index.xml", "./public/feed.xml")
	removeDir("./public/post")
	removeFile("./public/page/index.html")
	removeDir("./public/page/page")
	removeDir("./public/page/page/index.html")
	removeDir("./public/page/archives")
	removeFile("./public/index.xml")
	removeFileAnywhere("./public/page", "index.xml")
	removeFileAnywhere("./public/tags", "index.xml")
	removeFileAnywhere("./public/series", "index.xml")

	// Move everything from ./public up a level.
	entries, err = ioutil.ReadDir("./public")
	if err != nil {
		log.Fatalln(err)
	}
	for _, entry := range entries {
		err := os.Rename(filepath.Join("./public", entry.Name()), filepath.Join(".", entry.Name()))
		if err != nil {
			log.Fatalln(err)
		}
	}

	// Delete the ./public folder.
	err = os.RemoveAll("./public")
	if err != nil {
		log.Fatalln(err)
	}

	// Commit the updated static site.
	if exit := run("git", "add", "-A"); exit != 0 {
		log.Fatalf("failed to git add changes: %v\n", exit)
	}

	if exit := run("git", "commit", "-m", "Updated site"); exit > 1 {
		log.Fatalf("failed to git commit changes: %v\n", exit)
	}

	// Move back to the master branch and clean up any excess files.
	if exit := run("git", "checkout", "master"); exit != 0 {
		log.Fatalf("failed to checkout master: %v\n", exit)
	}

	if exit := run("git", "clean", "-fd"); exit != 0 {
		log.Fatalf("failed to git clean: %v\n", exit)
	}

	log.Println("DONE!")
}

func removeDir(dir string) {
	if err := os.RemoveAll(dir); err != nil {
		log.Fatal(err)
	}
}

func removeFile(file string) {
	if err := os.Remove(file); err != nil {
		log.Fatal(err)
	}
}

func removeFileAnywhere(dir, file string) {
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if strings.EqualFold(filepath.Base(path), file) {
			if e := os.Remove(path); e != nil {
				return e
			}
		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}

func moveFile(from, to string) {
	err := os.Rename(from, to)
	if err != nil {
		log.Fatal(err)
	}
}

func verifyRoot() {
	if _, err := os.Stat("make.go"); err != nil {
		log.Fatalln("make.go must be run from the root directory (where make.go is).")
	}
}

func run(name string, arg ...string) int {
	cmd := exec.Command(name, arg...)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Run()

	if err != nil {
		if ee, ok := err.(*exec.ExitError); ok {
			if s, ok := ee.Sys().(syscall.WaitStatus); ok {
				return s.ExitStatus()
			}
		}

		log.Fatalf("command failed: %v\n", err)
		return -1
	} else {
		return 0
	}
}
